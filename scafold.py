import requests
import json
from random import randint

headers = {'Content-type': 'application/json'}

ads = requests.get("http://127.0.0.1:10001/api/marketing/ads").json()['data']
prods = requests.get("http://127.0.0.1:10001/api/products").json()['data']
stores = requests.get("http://127.0.0.1:10000/api/stores").json()['data']

print(ads)
print(prods)
print(stores)

for store in stores:

    stock = []
    for prod in prods:
        stock.append({'stock': randint(0,9), 'price': randint(0,9), 'productId': prod['_id']})
    store['stock'] = stock


    ad1 = ads[randint(0,len(ads)-1)]
    ad2 = ads[randint(0,len(ads)-1)]
    store['adIds'] = [ad1['_id'], ad2['_id']]

    print(store)
    requests.put("http://127.0.0.1:10000/api/stores/"+store['_id'], data=json.dumps(store), headers=headers)
