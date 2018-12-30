import matplotlib.pyplot as plt
import numpy as np

from PIL import Image, ImageChops


def similarity(pixel1, pixel2):
    assert isinstance(pixel1, tuple) and isinstance(pixel2, tuple)
    assert len(pixel1) == 3 and len(pixel2) == 3

    sum_sqrt = sum(np.power(xi-xj, 2) for xi, xj in zip(pixel1, pixel2))
    delta_e = np.sqrt(sum_sqrt)

    return delta_e


def minkowski(x1, x2, alpha=1):
    '''
    Minkowski metric or Ln-Norm

    Generalized metric from Euclidean and Manhattan distance.
    Manhattan distance, if alpha = 1
    Euclidean distance, if alpha = 2
    Chebyshev dustance, if alpha > 2
    
    :param x1: n-dimension point at x1
    :type x1: tuple
    :param x2: n-dimension point at x2
    :type x2: tuple
    :param alpha: order of Minkowski metric, defaults to 1
    :param alpha: int, optional
    '''
    abs_diff = [np.power(np.abs(i-j), alpha) for i, j in zip(x1, x2)]
    alpha_root_sum = np.power(sum(abs_diff), 1/alpha)

    return alpha_root_sum


def cosine_similarity(x1, x2):
    zeros = (0, 0, 0)
    a = np.dot(x1, x2)
    b = minkowski(x1, zeros, 2)*minkowski(x2, zeros, 2)

    assert b > 0
    result = a/b

    return result


def disp_percent(dist, max_dist):
    return '{:.2f}%'.format(np.abs(1-((dist)/max_dist))*100)


def main():
    im_1 = Image.open('data/train_1.jpg')
    im_2 = Image.open('data/train_2.jpg')

    reim_1 = im_1.resize((250,200))
    a_im = np.asarray(im_1)
    alpha = 1

    black = (0, 0, 0)
    white = (255, 255, 255)
    max_euclid = similarity(black, white)
    max_minkowski = minkowski(black, white, alpha)

    print('='*10, 'Euclidean Metric', '='*10)
    print('min_error:', similarity((0, 0, 0), (0, 0, 0)))
    print('max_error:', max_euclid)

    print('='*10, 'Minkowski Metric', '='*10)
    print('min_error:', minkowski((0, 0, 0), (0, 0, 0), alpha))
    print('max_error:', max_minkowski)
    print('='*16, 'END', '='*16)


    red_store = {
        'black': (0, 0, 0),
        'maroon':(128,0,0),
        'dark red':(139,0,0),
        'crimson': (220,20,60),
        'tomato': (255,99,71),
        'green': (0, 128, 0),
        'dark orange': (255,140,0),
        'golden rod': (218,165,32),
        'royal blue': (65,105,225),
        'light pink': (255,182,193),
        'white': (255, 255, 255)
        }

    master_color = (255, 0, 0)
    for name, rgb in red_store.items():
        euclid_d = similarity(master_color, rgb)
        minkowski_d = minkowski(master_color, rgb, alpha)
        print(f'{name}{rgb}: {disp_percent(euclid_d, max_euclid)}')
        print(f'Minkow-{name}{rgb}: {disp_percent(minkowski_d, max_minkowski)}')
        print('='*25)


if __name__ == '__main__':
    main()
