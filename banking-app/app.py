from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>YMB Banking App - Auto Deploy</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #E6E1DF;
                color: #967069;
                margin: 0;
                padding: 2rem;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            h1 {
                color: #F86F6B;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>YMB Banking App - Auto Deploy</h1>
            <p>Financial Community Support Tracker API Service</p>
        </div>
    </body>
    </html>
    """

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5090)