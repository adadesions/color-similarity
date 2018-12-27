import matplotlib.pyplot as plt
import numpy as np

from PIL import Image, ImageChops


def similarity(pixel1, pixel2):
    assert isinstance(pixel1, tuple) and isinstance(pixel2, tuple)
    max_dist = 441.6
    r_diff = pixel1[0] - pixel2[0]
    g_diff = pixel1[1] - pixel2[1]
    b_diff = pixel1[2] - pixel2[2]
    delta_e = np.sqrt(r_diff**2 + g_diff**2 + b_diff**2)

    return '%.2f' % (np.abs(1-((delta_e)/max_dist))*100)


im_1 = Image.open('data/train_1.jpg')
im_2 = Image.open('data/train_2.jpg')

reim_1 = im_1.resize((250,200))
a_im = np.asarray(im_1)
print(a_im)


print('min:', similarity((0, 0, 0), (0, 0, 0)))
print('max:', similarity((255, 255, 255), (0, 0, 0)))
print('1-sh:', similarity((0, 0, 0), (1, 255, 255)))


