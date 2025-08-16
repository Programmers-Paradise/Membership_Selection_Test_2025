# 1. Problem Statement

In today’s digital world, people need to manage multiple accounts, each requiring strong and unique passwords. Storing these passwords in plain text is unsafe, as anyone who gains access to the file can read them directly.
The challenge is to securely store and retrieve passwords so that even if the storage file is stolen, the data remains unreadable without the correct encryption key.

# 2. My Approach

I made a small program in Python that can:
   - Change a password into a secret code (encrypt it).
   - Save the secret code in a file.
   - Change the secret code back into the real password (decrypt it).

## Why I chose this method:

- Python is easy for beginners.
- The cryptography library does all the hard work of locking and unlocking the password.
- The program keeps the lock key in a file (secret.key) so only people with this key can unlock the password.

// Concept and approach for this project were developed with assistance from ChatGPT.
// This project's code was generated with assistance from OpenAI ChatGPT.
// Prompt: "give me simple python code for beginner level cybersecurity project a password manager "

# 3. Code
```python
from cryptography.fernet import Fernet

# Step 1: Generate and save a key (only once)
def generate_key():
    key = Fernet.generate_key()
    with open("secret.key", "wb") as key_file:
        key_file.write(key)

# Step 2: Load the saved key
def load_key():
    return open("secret.key", "rb").read()

# Step 3: Encrypt a password
def encrypt_password(password):
    key = load_key()
    f = Fernet(key)
    return f.encrypt(password.encode())

# Step 4: Decrypt a password
def decrypt_password(encrypted_password):
    key = load_key()
    f = Fernet(key)
    return f.decrypt(encrypted_password).decode()

# MAIN PROGRAM
print(" Simple Python Password Manager")

# Generate key only if it doesn't exist yet
try:
    open("secret.key", "rb")
except FileNotFoundError:
    generate_key()

# Ask user for a password to store
user_password = input("Enter a password to store securely: ")

# Encrypt the password
encrypted_pw = encrypt_password(user_password)

# Save the encrypted password to a file
with open("password.txt", "wb") as file:
    file.write(encrypted_pw)

print("\n Password encrypted and saved!")

# Read and decrypt the password
with open("password.txt", "rb") as file:
    stored_encrypted_pw = file.read()

decrypted_pw = decrypt_password(stored_encrypted_pw)
print(f" Decrypted password is: {decrypted_pw}")
```
