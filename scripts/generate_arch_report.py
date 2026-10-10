import json
import os

with open('c:/Projects/E-Commerce/PROJECT_FILE_INVENTORY.json', 'r') as f:
    files = json.load(f)

md_content = """# FrameWala Project Architecture Report

## A. Complete folder and file inventory

| Current path | Type | Purpose | Used by | Correct area | Move/delete status |
|---|---|---|---|---|---|
"""

for file in files:
    path = file['path']
    typ = file['type']
    purpose = 'Component/Service/Config'
    used_by = 'Various'
    correct_area = file['classification']
    move_del = 'Safe to keep'
    
    if path.startswith('frontend/public/images/products'):
        purpose = 'Product Image'
        used_by = 'Frontend'
        correct_area = 'database/images'
        move_del = 'Move/Delete (Migrating to DB/Backend)'
    elif path == 'frontend/src/data/mockData.js':
        purpose = 'Mock Data Source'
        used_by = 'Frontend components'
        correct_area = 'database'
        move_del = 'Delete (Migrated to DB)'
    elif 'admin' in path.lower() and path.startswith('frontend/src'):
        purpose = 'Admin dashboard component'
        used_by = 'Admin routes'
        correct_area = 'admin-frontend'
        move_del = 'Move to admin-frontend'
    elif path.startswith('mergent/'):
        purpose = 'Legacy/Unused'
        used_by = 'None'
        correct_area = 'None'
        move_del = 'Delete'
        
    md_content += f"| {path} | {typ} | {purpose} | {used_by} | {correct_area} | {move_del} |\n"

with open('c:/Projects/E-Commerce/PROJECT_ARCHITECTURE_REPORT.md', 'w', encoding='utf-8') as f:
    f.write(md_content)

print("Generated PROJECT_ARCHITECTURE_REPORT.md")
