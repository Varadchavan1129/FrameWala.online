import os
import re

files_formatINR = [
    'c:/Projects/E-Commerce/frontend/src/pages/customer/Home.jsx',
    'c:/Projects/E-Commerce/frontend/src/pages/customer/Checkout.jsx',
    'c:/Projects/E-Commerce/frontend/src/pages/customer/Cart.jsx',
    'c:/Projects/E-Commerce/frontend/src/components/customer/ProductCard.jsx'
]

for file in files_formatINR:
    with open(file, 'r') as f:
        content = f.read()
    content = re.sub(r'import\s+{\s*formatINR\s*}\s+from\s+[\'\"].*mockData\.js[\'\"];?', "import { formatINR } from '../../utils/formatters.js';", content)
    with open(file, 'w') as f:
        f.write(content)

files_categories = [
    'c:/Projects/E-Commerce/frontend/src/pages/customer/Products.jsx',
    'c:/Projects/E-Commerce/frontend/src/components/common/Navbar.jsx'
]

for file in files_categories:
    with open(file, 'r') as f:
        content = f.read()
    content = re.sub(r'import\s+{\s*FILTER_CATEGORIES\s*}\s+from\s+[\'\"].*mockData\.js[\'\"];?', "import { FILTER_CATEGORIES } from '../../constants/productConstants.js';", content)
    with open(file, 'w') as f:
        f.write(content)

print('Updated imports.')
