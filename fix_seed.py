# -*- coding: utf-8 -*-
import re

file_path = r'c:\Users\patil\OneDrive\Desktop\SIH\RAILAPP_REF\src\data\seedData.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove zone/division from User objects only (inside SEED_USERS array)
# We know the user objects have id starting with 'user-'
# Pattern: find user objects and remove spurious zone/division lines
# We can detect them by looking at the SEED_USERS block

seed_users_pattern = r"(export const SEED_USERS: User\[\] = \[.*?^\];)"
match = re.search(seed_users_pattern, content, re.DOTALL | re.MULTILINE)
if match:
    users_block = match.group(1)
    # Remove lines that are just "    zone: 'CR'," or "    division: 'PUNE',"
    cleaned = re.sub(r"    zone: 'CR',\n", '', users_block)
    cleaned = re.sub(r"    division: 'PUNE',\n", '', cleaned)
    content = content[:match.start()] + cleaned + content[match.end():]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed SEED_USERS.')
