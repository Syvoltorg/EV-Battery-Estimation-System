from flask import Flask, request, jsonify
from google.oauth2 import id_token
from google.auth.transport import requests
from flask_cors import CORS # Import Flask-CORS
from flask_sqlalchemy import SQLAlchemy # Import Flask-SQLAlchemy
from datetime import datetime
# Import your token generation logic here (e.g., from your_auth_utils import generate_app_token)

app = Flask(__name__)
CORS(app) # Enable CORS for all origins - IMPORTANT for frontend/backend communication

# Configure your database (Example using SQLite)
# IMPORTANT: If you use PostgreSQL, MySQL, etc., change this line and install the necessary connector
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///vehicle_management.db' # SQLite database file will be created in the backend folder
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # Recommended setting

db = SQLAlchemy(app)

# Define your User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True) # Email might not always be unique if user uses different Google accounts or signs up with email/password later
    name = db.Column(db.String(120), nullable=True)
    picture = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<User {self.email or self.google_id}>'

# Define your Vehicle Model
class Vehicle(db.Model):
    __tablename__ = 'vehicles'
    vehicle_id = db.Column(db.Integer, primary_key=True)
    model = db.Column(db.String(100), nullable=False)
    manufacturer = db.Column(db.String(100), nullable=False)
    vin = db.Column(db.String(50), unique=True, nullable=False)
    registration_number = db.Column(db.String(50), unique=True, nullable=False)
    battery_capacity = db.Column(db.Float, nullable=False)
    battery_type = db.Column(db.String(50), nullable=False)
    range = db.Column(db.Float, nullable=False)
    efficiency = db.Column(db.Float, nullable=False)
    energy_consumption = db.Column(db.Float, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255))
    owner_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    current_soc = db.Column(db.Float)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='active')
    manufacturing_date = db.Column(db.Date)
    warranty_expiry = db.Column(db.Date)
    insurance_expiry = db.Column(db.Date)
    last_service_date = db.Column(db.Date)
    next_service_date = db.Column(db.Date)
    total_distance = db.Column(db.Float, default=0)

    def __repr__(self):
        return f'<Vehicle {self.model} - {self.registration_number}>'

# !!! IMPORTANT: Your Google Client ID !!!
GOOGLE_CLIENT_ID = '209642340175-i634dqrurup7eeghb6plmrsujp3no466.apps.googleusercontent.com'

@app.route('/api/auth/google', methods=['POST'])
def google_auth():
    """
    Receives Google ID token from frontend, verifies it, and handles user in DB.
    """
    # Get the token from the frontend request body
    data = request.get_json()
    token = data.get('credential')

    if not token:
        print("Error: Missing credential in request data")
        return jsonify({'error': 'Missing credential'}), 400

    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        # Verifies the token and checks if it was issued for your client ID.
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)

        # Optional: Verify the audience if you have multiple clients
        # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
        #     raise ValueError('Could not verify audience.')

        # Optional: Verify the hosted domain if you restrict to a G Suite domain
        # if idinfo['hd'] == 'mycustomer.com':
        #     raise ValueError('Wrong hosted domain.')

        # Extract relevant user information from the verified token payload
        google_id = idinfo.get('sub') # 'sub' is the unique Google user ID
        email = idinfo.get('email')
        name = idinfo.get('name')
        picture = idinfo.get('picture')

        if not google_id:
             print("Error: Google token did not contain a user ID (sub)")
             return jsonify({'error': 'Invalid token payload: Missing user ID'}), 401


        print(f"Successfully verified Google token for user ID: {google_id}")
        print(f"User Info - Email: {email}, Name: {name}, Picture: {picture}")

        # --- Database Interaction ---
        # 1. Look up user in your database by Google ID (google_id).
        user = User.query.filter_by(google_id=google_id).first()

        # 2. If user doesn't exist, create a new user record.
        if user is None:
            print("User not found in DB, creating new user...")
            # Consider if you want email to be nullable or handle potential duplicates if email is unique
            user = User(google_id=google_id, email=email, name=name, picture=picture)
            db.session.add(user)
            db.session.commit() # Save the new user to the database
            print(f"New user created in DB with ID: {user.id}")
        else:
            print(f"Existing user found in DB with ID: {user.id}")
            # Optional: Update existing user info if needed (e.g., name, picture)
            # user.name = name
            # user.picture = picture
            # db.session.commit() # Commit the update

        # 3. Generate your application's own internal authentication token (e.g., a JWT).
        # This token identifies the user within YOUR application for future authenticated requests.
        # You need to implement a `generate_app_token` function that takes user.id
        # and creates a secure token (e.g., using PyJWT).
        # app_token = generate_your_app_token(user.id) # <-- Implement this!
        # print(f"Generated app token for user {user.id}")


        # --- End Database Interaction ---

        # Return a success response.
        # In a real application, you would return your generated `app_token` here,
        # along with any user details the frontend needs.
        return jsonify({
            'message': 'Google token verified and user handled in DB',
            # 'app_token': app_token, # <-- Uncomment and return your actual token
            'user_details': { # You might return some basic user details for the frontend
                 'id': user.id,
                 'name': user.name,
                 'email': user.email
                 # ... other details the frontend needs
            }
        }), 200

    except ValueError as e:
        # Token is invalid (e.g., expired, wrong client ID, tampered)
        print(f"Error verifying Google token: {e}")
        return jsonify({'error': f'Invalid Google token: {e}'}), 401
    except Exception as e:
        # Catch any other unexpected errors
        db.session.rollback() # Rollback the session in case of any database error
        print(f"An unexpected error occurred during Google auth: {e}")
        # Log the full traceback in a real app for debugging
        return jsonify({'error': 'An internal server error occurred'}), 500

# Add a route to create database tables (run this once after setting up)
# Visit http://127.0.0.1:5000/create-db in your browser after starting the server
# to create the SQLite database file and tables.
@app.route('/create-db')
def create_db_route():
    try:
        # Ensure you are in the application context
        with app.app_context():
            db.create_all()
        print("Database tables created!")
        return jsonify({'message': 'Database tables created!'}), 200
    except Exception as e:
        print(f"Error creating database tables: {e}")
        # Log the full traceback in a real app for debugging
        return jsonify({'error': f'Error creating database tables: {e}'}), 500

# New route to fetch and display vehicle data
@app.route('/api/vehicles', methods=['GET'])
def get_vehicles():
    vehicles = Vehicle.query.all()
    vehicle_list = []
    for vehicle in vehicles:
        vehicle_list.append({
            'vehicle_id': vehicle.vehicle_id,
            'model': vehicle.model,
            'manufacturer': vehicle.manufacturer,
            'vin': vehicle.vin,
            'registration_number': vehicle.registration_number,
            'battery_capacity': vehicle.battery_capacity,
            'battery_type': vehicle.battery_type,
            'range': vehicle.range,
            'efficiency': vehicle.efficiency,
            'energy_consumption': vehicle.energy_consumption,
            'weight': vehicle.weight,
            'image_url': vehicle.image_url,
            'owner_id': vehicle.owner_id,
            'current_soc': vehicle.current_soc,
            'last_updated': vehicle.last_updated.isoformat() if vehicle.last_updated else None,
            'status': vehicle.status,
            'manufacturing_date': vehicle.manufacturing_date.isoformat() if vehicle.manufacturing_date else None,
            'warranty_expiry': vehicle.warranty_expiry.isoformat() if vehicle.warranty_expiry else None,
            'insurance_expiry': vehicle.insurance_expiry.isoformat() if vehicle.insurance_expiry else None,
            'last_service_date': vehicle.last_service_date.isoformat() if vehicle.last_service_date else None,
            'next_service_date': vehicle.next_service_date.isoformat() if vehicle.next_service_date else None,
            'total_distance': vehicle.total_distance
        })
    return jsonify(vehicle_list), 200

if __name__ == '__main__':
    # In a production deployment, use a production-ready WSGI server (Gunicorn, uWSGI).
    # Debug=True should be False in production.
    # host='0.0.0.0' makes the server accessible from your local network.
    app.run(debug=True, host='0.0.0.0', port=5001) 