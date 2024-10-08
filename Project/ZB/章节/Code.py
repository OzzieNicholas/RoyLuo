# Define the file path
file_path = 'test.txt'  # Make sure the file is in the same directory as your script

# Read the file content
try:
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Perform the replacements as specified
    content = content.replace(r'\(', '$').replace(r'\)', '$')
    content = content.replace(r'\[', '$$').replace(r'\]', '$$')
    content = content.replace('**', '')

    # Save the transformed content to a new file (optional)
    new_file_path = 'transformed_test.txt'
    with open(new_file_path, 'w', encoding='utf-8') as file:
        file.write(content)

    print(f"Content has been successfully transformed and saved to '{new_file_path}'.")

except FileNotFoundError:
    print("The file 'test.txt' was not found in the current directory.")
