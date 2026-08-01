import re
import codecs

with codecs.open('update_frontend.py', 'r', 'utf-8', errors='ignore') as f:
    upd = f.read()

# Extract new_admin_js
m = re.search(r'new_admin_js = """(.*?)"""', upd, flags=re.DOTALL)
if m:
    js = m.group(1)
    
    with codecs.open('templates/admin.html', 'r', 'utf-8') as f:
        admin_html = f.read()
        
    # Replace script
    admin_html = re.sub(r'<script>.*?</script>', js, admin_html, flags=re.DOTALL)
    
    with codecs.open('templates/admin.html', 'w', 'utf-8') as f:
        f.write(admin_html)
    print("Fixed admin JS")
else:
    print("Could not find js")
