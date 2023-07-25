# https://github.com/2captcha/2captcha-python

import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))

from twocaptcha import TwoCaptcha

api_key = os.getenv('APIKEY_2CAPTCHA', '947cc0d64ae0aeab7499bc9fbd8fe2f7')

solver = TwoCaptcha(api_key)

try:
    result = solver.normal(sys.argv[1])

except Exception as e:
    sys.stdout.flush()

else:
    sys.stdout.flush()