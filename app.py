from flask import Flask, render_template, request, send_file
from PIL import Image
from io import BytesIO

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_jpg', methods=['POST'])
def generate_jpg():
    image = Image.open(request.files['image'])
    
    # Convert RGBA to RGB if necessary
    if image.mode == 'RGBA':
        image = image.convert('RGB')
    
    img_io = BytesIO()
    image.save(img_io, 'JPEG', quality=100)
    img_io.seek(0)
    return send_file(img_io, mimetype='image/jpeg', as_attachment=True, download_name='id_card.jpg')

@app.route('/generate_pdf', methods=['POST'])
def generate_pdf():
    image = Image.open(request.files['image'])
    pdf_io = BytesIO()
    image.save(pdf_io, 'PDF', quality=100)
    pdf_io.seek(0)
    return send_file(pdf_io, mimetype='application/pdf', as_attachment=True, download_name='id_card.pdf')

if __name__ == '__main__':
    app.run(debug=False,host='0.0.0.0')
