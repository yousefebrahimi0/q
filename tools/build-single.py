"""Build q.html: one offline file with CSS, JS, fonts and images inlined. Run: python3 tools/build-single.py"""
import base64, mimetypes, pathlib, re
mimetypes.add_type('image/webp', '.webp')
root = pathlib.Path(__file__).resolve().parent.parent
def data(p):
    p = root / p
    if not p.exists(): return None
    m = mimetypes.guess_type(p.name)[0] or ('font/woff2' if p.suffix == '.woff2' else 'application/octet-stream')
    return f"data:{m};base64,{base64.b64encode(p.read_bytes()).decode()}"
html = (root / 'index.html').read_text()
css = (root / 'css/q.css').read_text()
css = re.sub(r'url\("\.\./(fonts/[^"]+)"\)', lambda m: f'url("{data(m.group(1))}")', css)
html = re.sub(r'<link rel="stylesheet" href="css/q\.css(?:\?[^"]*)?">', f'<style>{css}</style>', html)
html = re.sub(r'<script src="(js/[^"?]+)(?:\?[^"]*)?"></script>', lambda m: '<script>' + (root / m.group(1)).read_text().replace('</script', '<\\/script') + '</script>', html)
html = re.sub(r'src="(assets/[^"]+)"', lambda m: f'src="{data(m.group(1)) or m.group(1)}"', html)
html = re.sub(r'(?:href|xlink:href)="(assets/[^"]+)"', lambda m: m.group(0).split('="')[0] + f'="{data(m.group(1)) or m.group(1)}"', html)
(root / 'q.html').write_text(html)
print('q.html', round(len(html) / 1024), 'KB')
