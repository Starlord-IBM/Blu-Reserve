import os

def create_txt_duplicates():
    # Base directory where original files are located
    source_base = 'frontend'  # Change this to your original folder path
    # Base directory for new txt files
    target_base = 'fr'
    
    # Define the directory structure with files
    structure = {
        'src': {
            'components': [
                'BookingCard.js',
                'CircularSeating.js',
                'NavBar.js',
                'PrivateRoute.js',
                'SeatMap.js',
                'TimeSelector.js',
                'TimeSlotPicker.js'
            ],
            'context': [
                'AuthContext.js'
            ],
            'pages': [
                'BookSeats.js',
                'Home.js',
                'Login.js',
                'MyBookings.js',
                'Register.js'
            ],
            'services': [
                'api.js'
            ]
        }
    }
    
    # Additional files directly in src
    src_files = [
        'App.css',
        'App.js',
        'App.test.js',
        'index.css',
        'index.js'
    ]
    
    # Create base directory (fr)
    if not os.path.exists(target_base):
        os.makedirs(target_base)
    
    # Create src directory
    src_target_path = os.path.join(target_base, 'src')
    src_source_path = os.path.join(source_base, 'src')
    if not os.path.exists(src_target_path):
        os.makedirs(src_target_path)
    
    # First handle files directly in src
    for file in src_files:
        if file.endswith('.js'):
            source_file = os.path.join(src_source_path, file)
            target_file = os.path.join(src_target_path, f"{os.path.splitext(file)[0]}.txt")
            
            try:
                if os.path.exists(source_file):
                    with open(source_file, 'r', encoding='utf-8') as sf:
                        content = sf.read()
                    
                    with open(target_file, 'w', encoding='utf-8') as tf:
                        tf.write(content)
                    print(f"Successfully copied content from {source_file} to {target_file}")
                else:
                    print(f"Source file not found: {source_file}")
                    
            except Exception as e:
                print(f"Error processing {file}: {str(e)}")
    
    # Then handle the subdirectories
    for main_dir, subdirs in structure.items():
        # Create subdirectories and their files
        for subdir, files in subdirs.items():
            target_path = os.path.join(src_target_path, subdir)
            source_path = os.path.join(src_source_path, subdir)
            
            if not os.path.exists(target_path):
                os.makedirs(target_path)
                
            # Copy content for each .js file
            for file in files:
                if file.endswith('.js'):
                    source_file = os.path.join(source_path, file)
                    target_file = os.path.join(target_path, f"{os.path.splitext(file)[0]}.txt")
                    
                    try:
                        if os.path.exists(source_file):
                            with open(source_file, 'r', encoding='utf-8') as sf:
                                content = sf.read()
                                
                            with open(target_file, 'w', encoding='utf-8') as tf:
                                tf.write(content)
                            print(f"Successfully copied content from {source_file} to {target_file}")
                        else:
                            print(f"Source file not found: {source_file}")
                            
                    except Exception as e:
                        print(f"Error processing {file}: {str(e)}")

if __name__ == "__main__":
    create_txt_duplicates()
    print("Text file duplicates have been created in the 'fr' directory with original content.")