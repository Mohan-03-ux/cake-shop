import re
import codecs

with codecs.open('templates/admin.html', 'r', 'utf-8', errors='ignore') as f:
    text = f.read()

# Fix corrupted mojibake from previous cat commands
text = re.sub(r'\?3', '⏳', text)
text = re.sub(r'o\.', '✅', text)
text = re.sub(r'dY\?', '🍰', text)
text = re.sub(r'dY`\?,\?', '👁️', text)
text = re.sub(r'dY-`,\?', '🗑️', text)
text = re.sub(r',1', '₹', text)
text = re.sub(r'\?"', '—', text)
text = re.sub(r'dY"', '📱', text)
text = re.sub(r' \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \?', '══════════════════════════════════', text)

with codecs.open('templates/admin.html', 'w', 'utf-8') as f:
    f.write(text)
print("Emojis fixed")
