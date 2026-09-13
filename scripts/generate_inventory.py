import os
import json

files = []
ignore_dirs = ['node_modules', '.git', 'dist', 'build', '.vite', '.emergent']

for root, dirs, filenames in os.walk('c:/Projects/E-Commerce'):
    # modify dirs in place to skip ignored directories
    dirs[:] = [d for d in dirs if d not in ignore_dirs]
    
    for f in filenames:
        path = os.path.relpath(os.path.join(root, f), 'c:/Projects/E-Commerce').replace('\\', '/')
        ext = f.split('.')[-1] if '.' in f else 'file'
        
        # Classification guess logic
        classification = 'shared'
        if path.startswith('frontend/'):
            classification = 'frontend'
        elif path.startswith('admin-frontend/'):
            classification = 'frontend'
        elif path.startswith('backend/'):
            classification = 'backend'
        elif path.startswith('database/'):
            classification = 'database'
        
        if 'public/' in path or path.endswith(('.jpg', '.png', '.svg', '.webp')):
            classification = 'asset'
        if f in ['package.json', 'package-lock.json', '.env', 'vite.config.js', 'eslint.config.js', 'tailwind.config.js']:
            classification = 'configuration'
        if path.endswith('.md'):
            classification = 'documentation'
            
        files.append({
            'path': path,
            'name': f,
            'type': ext,
            'purpose': 'TODO: Add purpose',
            'classification': classification,
            'used_by': 'TODO',
            'safe_to_move': True,
            'safe_to_delete': False,
            'recommended_destination': 'TODO'
        })

with open('c:/Projects/E-Commerce/PROJECT_FILE_INVENTORY.json', 'w') as out:
    json.dump(files, out, indent=2)

print(f"Inventory saved. Found {len(files)} files.")
