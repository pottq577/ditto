import io
from flask import Flask, request, send_file
from flask_cors import CORS
from rembg import remove
from PIL import Image

app = Flask(__name__)
CORS(app)

@app.route('/remove', methods=['POST'])
def remove_background():
    if 'image' not in request.files:
        return 'No image provided', 400
    
    file = request.files['image']
    input_image = Image.open(file.stream)
    
    output_image = remove(input_image)
    
    img_byte_arr = io.BytesIO()
    output_image.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    return send_file(img_byte_arr, mimetype='image/png')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
