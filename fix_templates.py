import os
import re

html_files = ["about.html", "admin.html", "cart.html", "contact.html", "customize.html", "index.html"]

footer = """  <footer role="contentinfo">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="nav-logo">BakedWithLove <span style="color:var(--blush);">by</span> Muskan</div>
        <p>Handcrafted cakes for life's sweetest moments. Made fresh with love in Badabazar, Sambalpur — delivered to your door.</p>
        <div class="footer-social" aria-label="Social media links">
          <a class="social-icon" href="https://instagram.com/bakedwithlove_by_muskan" aria-label="Instagram" target="_blank" rel="noopener">📷</a>
          <a class="social-icon" href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener">📘</a>
          <a class="social-icon" href="https://wa.me/919861496150" aria-label="WhatsApp" target="_blank" rel="noopener">💬</a>
        </div>
      </div>
      <nav class="footer-col" aria-label="Quick links">
        <h4>Quick Links</h4>
        <a href="/">Home</a>
        <a href="/#cakes">Our Cakes</a>
        <a href="/about">About Us</a>
        <a href="/contact">Contact</a>
        <a href="/cart">Cart</a>
      </nav>
      <div class="footer-col">
        <h4>Our Cakes</h4>
        <li>Birthday Cakes</li>
        <li>Wedding Cakes</li>
        <li>Custom Designs</li>
        <li>Eggless Cakes</li>
        <li>Fusion Cakes</li>
      </div>
      <address class="footer-col" style="font-style:normal;">
        <h4>Get In Touch</h4>
        <a href="tel:+919861496150">📞 +91 98614 96150</a>
        <a href="mailto:bakedwithlove@gmail.com">✉️ bakedwithlove@gmail.com</a>
        <li>🕒 Mon–Sat: 9am – 8pm</li>
        <li>🕒 Sunday: 10am – 6pm</li>
        <li>📍 Badabazar, Sambalpur, Odisha</li>
      </address>
    </div>
    <div class="footer-bottom">
      <p>© 2024 BakedWithLove by Muskan. All rights reserved. Made with ❤️ in Sambalpur.</p>
      <p><a href="#">Privacy Policy</a> · <a href="#">Terms</a></p>
    </div>
  </footer>"""

if not os.path.exists("templates"):
    os.makedirs("templates")

for f in html_files:
    if not os.path.exists(f): continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Replace static URLs (Jinja) - we only do this if it's not already using Jinja
    # The root files in my restore were probably pure HTML!
    
    # Ensure hrefs and srcs point to Jinja (basic implementation)
    def replacer(match):
        filename = match.group(1)
        if filename.startswith('http') or filename.startswith('mailto') or filename.startswith('tel') or filename.startswith('#') or filename.startswith('/'):
            return match.group(0) # Keep as is
        return f'{match.group(0).split("=")[0]}="{{{{ url_for(\'static\', filename=\'{filename}\') }}}}"'
        
    content = re.sub(r'href="([^"]+\.css)"', replacer, content)
    content = re.sub(r'src="([^"]+\.js)"', replacer, content)
    content = re.sub(r'src="([^"]+\.(?:png|jpg|jpeg|svg))"', replacer, content)
    
    # Replace old brand details
    content = content.replace('Crème <span style="color:var(--blush);">&</span> Co.', 'BakedWithLove <span style="color:var(--blush);">by</span> Muskan')
    content = content.replace('Crème & Co', 'BakedWithLove by Muskan')
    content = content.replace('hello@cremeco.in', 'bakedwithlove@gmail.com')
    content = content.replace('Mumbai', 'Sambalpur')
    
    # Replace footers completely
    content = re.sub(r'<footer role="contentinfo">.*?</footer>', footer, content, flags=re.DOTALL)
    
    # Apply specific changes
    if f == "index.html":
        # Replace the cake float section completely
        old_cake = r'<div class="cake-float">.*?</div>'
        new_cake = '''<div class="cake-float">
          <img
            src="{{ url_for('static', filename='hero_popup_image.jpg') }}"
            alt="BakedWithLove by Muskan"
            style="width:100%;height:100%;object-fit:cover;border-radius:50%;"
          />
        </div>'''
        content = re.sub(old_cake, new_cake, content, flags=re.DOTALL)
        
        # Center the feedback sub text
        content = content.replace('<p class="section-sub">Loved your cake? Tell us! Your feedback helps us bake better every day. 🎂</p>',
                                '<p class="section-sub" style="text-align:center;margin-left:auto;margin-right:auto;">Loved your cake? Tell us! Your feedback helps us bake better every day. 🎂</p>')
    elif f == "about.html":
        content = content.replace('src="{{ url_for(\'static\', filename=\'bakedwithlove.png\') }}"', 'src="{{ url_for(\'static\', filename=\'hero_popup_image.jpg\') }}"')
        
    with open(os.path.join("templates", f), 'w', encoding='utf-8') as out:
        out.write(content)

print("Fixed templates generated.")
