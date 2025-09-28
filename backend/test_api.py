import requests
import json

try:
    # Test health endpoint
    print("Testing health endpoint...")
    response = requests.get('http://localhost:8000/health')
    print(f'Health Status: {response.status_code}')
    print(f'Health Response: {response.json()}')
    print()
    
    # Test concepts endpoint
    print("Testing concepts endpoint...")
    response = requests.get('http://localhost:8000/api/v1/concepts/?page=1&size=5')
    print(f'Concepts Status: {response.status_code}')
    if response.status_code == 200:
        print(f'Concepts Response: {json.dumps(response.json(), indent=2)}')
    else:
        print(f'Concepts Error: {response.text}')
    print()
    
    # Test codesystems endpoint
    print("Testing codesystems endpoint...")
    response = requests.get('http://localhost:8000/api/v1/codesystems/?page=1&size=5')
    print(f'CodeSystems Status: {response.status_code}')
    if response.status_code == 200:
        print(f'CodeSystems Response: {json.dumps(response.json(), indent=2)}')
    else:
        print(f'CodeSystems Error: {response.text}')
        
except Exception as e:
    print(f'Error: {e}')
