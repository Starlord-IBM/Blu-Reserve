import subprocess
import sys
import os
from threading import Thread
import time

def run_backend():
    """Run the FastAPI backend"""
    try:
        os.chdir("backend")
        subprocess.run(["uvicorn", "app.main:app", "--reload", "--port", "8000"])
    except Exception as e:
        print(f"Backend Error: {e}")
    finally:
        os.chdir("..")

def run_frontend():
    """Run the Streamlit frontend"""
    try:
        os.chdir("frontend")
        subprocess.run(["streamlit", "run", "app.py", "--server.port", "8501"])
    except Exception as e:
        print(f"Frontend Error: {e}")
    finally:
        os.chdir("..")

def main():
    # Start backend in a separate thread
    backend_thread = Thread(target=run_backend)
    backend_thread.daemon = True
    backend_thread.start()

    # Wait a bit for backend to start
    time.sleep(2)

    # Start frontend
    run_frontend()

if __name__ == "__main__":
    main()