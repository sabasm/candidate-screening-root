import time
from functools import wraps

class LLMError(Exception):
   pass

class RateLimitError(LLMError):
   pass

class ParseError(LLMError):
   pass

def retry_with_exponential_backoff(max_retries=3):
   def decorator(func):
       @wraps(func)
       async def wrapper(*args, **kwargs):
           retries = 0
           while retries <= max_retries:
               try:
                   return await func(*args, **kwargs)
               except RateLimitError:
                   if retries == max_retries:
                       raise
                   
                   sleep_time = 2 ** retries
                   time.sleep(sleep_time)
                   retries += 1
               except Exception as e:
                   if retries == max_retries:
                       raise
                   
                   if isinstance(e, ParseError) and retries > 0:
                       raise
                       
                   retries += 1
       return wrapper
   return decorator


