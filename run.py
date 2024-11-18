import subprocess
import time
import os
from threading import Thread

def run_backend():
    try:
        os.chdir("backend")
        subprocess.run(["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"])
    except Exception as e:
        print(f"Backend Error: {e}")
    finally:
        os.chdir("..")

def run_frontend():
    try:
        os.chdir("frontend")
        subprocess.run(["npm", "start"])
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
    frontend_thread = Thread(target=run_frontend)
    frontend_thread.daemon = True
    frontend_thread.start()

    try:
        # Keep the main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down...")

if __name__ == "__main__":
    main()