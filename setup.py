# setup.py
import subprocess
import sys
import os

def setup_virtual_environment():
    """Setup virtual environment and install requirements"""
    try:
        # Create virtual environment
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
        
        # Determine the pip path
        if os.name == 'nt':  # Windows
            pip_path = os.path.join("venv", "Scripts", "pip")
        else:  # Linux/Mac
            pip_path = os.path.join("venv", "bin", "pip")
        
        # Install requirements
        subprocess.run([pip_path, "install", "-r", "backend/requirements.txt"], check=True)
        subprocess.run([pip_path, "install", "-r", "frontend/requirements.txt"], check=True)
        
        print("Virtual environment setup completed successfully!")
        
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    setup_virtual_environment()