from rembg import remove
from PIL import Image
import sys
import os

def remove_background(input_path, output_path):
    try:
        with Image.open(input_path) as img:
            output = remove(img)
            output.save(output_path)
        print(f"Background removed successfully. Saved to {output_path}")
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python remove_bg.py <input_image> <output_image>")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    if not os.path.exists(input_path):
        print(f"Error: Input file does not exist: {input_path}")
        sys.exit(1)

    success = remove_background(input_path, output_path)
    sys.exit(0 if success else 1)

