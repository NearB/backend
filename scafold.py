import requests
import json
from random import randint
from datetime import datetime, timedelta

headers = {'Content-type': 'application/json'}

ads = requests.get("http://127.0.0.1:10001/api/marketing/ads").json()['data']
if not ads:
    defaultAds = [
        {
          "name": "Hamburguesa Premium",
          "img": "https://i1.wallpaperscraft.com/image/hamburger_fast_food_roll_bacon_onions_tomato_salad_sauce_5826_225x300.jpg",
          "tags": [
            "Hambuersa",
            "Burguer",
            "Premium"
          ]
        },
        {
          "name": "Burguer & Papas",
          "img": "http://www.cellphone-wallpapers.net/Wallpapers/Iphone/Food/055.jpg",
          "tags": [
            "Hambuersa",
            "Burguer",
            "Papas",
            "Fries"
          ]
        },
        {
          "name": "Pizza 6",
          "img": "https://wallpaperscraft.com/image/pizza_piece_cheese_fast_food_1425_240x320.jpg",
          "tags": [
            "Pizza",
            "Chica"
          ]
        },
        {
          "name": "Pizza 12",
          "img": "https://s-media-cache-ak0.pinimg.com/originals/1c/3a/5b/1c3a5bcf9b26fd184b8c6139dc47d485.jpg",
          "tags": [
            "Pizza",
            "Grande"
          ]
        },
        {
          "name": "Pinta & Burguer",
          "img": "http://theburgeradventure.com/wp-content/uploads/2011/10/The-Burger-Adventure_Beer-Deluxe.jpg",
          "tags": [
            "Burguer",
            "Pint",
            "Pinta",
            "Porron"
          ]
        },
        {
          "name": "After Hour",
          "img": "https://i.vimeocdn.com/portrait/4798468_300x300",
          "tags": [
            "After"
          ]
        }
    ]

    for ad in defaultAds:
        requests.post("http://127.0.0.1:10001/api/marketing/ads", data=json.dumps(ad), headers=headers)

    ads = requests.get("http://127.0.0.1:10001/api/marketing/ads").json()['data']

prods = requests.get("http://127.0.0.1:10001/api/products").json()['data']
if not prods:
    defaultProds = [
        {
          "name": "Belgian Pale Ale",
          "img": "http://blog.twobeerdudes.com/wp-content/uploads/2012/08/brett_backspin_belgian_pale_ale.jpg",
          "description": "abv: 4.0-7.0%, delicate hop finish, sweetish to toasty malt overtones",
          "tags": [
            "beer",
            "blonde"
          ]
        },
        {
          "name": "Coffee Stout",
          "img": "https://s3.amazonaws.com/brewerydbapi/beer/onGh9g/upload_VuPXQJ-medium.png",
          "description": "ABV: 5.7%, IBU: 30, Pale, Caramel, Roasted Barley, Oats",
          "tags": [
            "beer",
            "stout",
            "roasted"
          ]
        },
        {
          "name": "Papas rusticas",
          "img": "https://img-global.cpcdn.com/002_photo_reports/1090036_22661fe5df9c37fd/200x200cq70/photo.jpg",
          "description": "Porcion de papas rusticas para dos personas",
          "tags": [
            "Papas",
            "Food"
          ]
        }
    ]

    for item in defaultProds:
        requests.post("http://127.0.0.1:10001/api/products", data=json.dumps(item), headers=headers)

    prods = requests.get("http://127.0.0.1:10001/api/products").json()['data']

campaigns = requests.get("http://127.0.0.1:10001/api/marketing/campaigns").json()['data']
if not campaigns:
    campaign = {
      "name": "Broad Campaign",
      "expiration": datetime.now() + timedelta(days=30)
    }
    campaign['ads'] = []
    campaign['tags'] = []
    for times in range(0, randint(0,len(ads)-1)):
        ad = ads[randint(0,len(ads)-1)]
        campaign['ads'].append(ad)
        campaign['tags'].append(ad['tags'])

    requests.post("http://127.0.0.1:10001/api/marketing/campaigns", data=json.dumps(campaign), headers=headers)

    campaign = {
      "name": "Short Campaign",
      "expiration": datetime.now() + timedelta(days=1)
    }
    campaign['ads'] = []
    campaign['tags'] = []
    for times in range(0, randint(0,len(ads)-1)):
        ad = ads[randint(0,len(ads)-1)]
        campaign['ads'].append(ad)
        campaign['tags'].append(ad['tags'][randint(0,len(ad['tags'])-1)])

    requests.post("http://127.0.0.1:10001/api/marketing/campaigns", data=json.dumps(campaign), headers=headers)

    campaigns = requests.get("http://127.0.0.1:10001/api/marketing/campaigns").json()['data']


stores = requests.get("http://127.0.0.1:10000/api/stores").json()['data']
for store in stores:
    store['stock'] = []
    for prod in prods:
        store['stock'].append({'stock': randint(0,9), 'price': randint(0,9), 'productId': prod['_id']})

    store['adIds'] = []
    for times in range(0, randint(0,len(ads)-1)):
        store['adIds'].append(ads[randint(0,len(ads)-1)]['_id'])

    print(campaigns)
    store['campaignIds'] = [campaigns[randint(0,len(campaigns)-1)]['_id']]

    print(store)
    requests.put("http://127.0.0.1:10000/api/stores/"+store['_id'], data=json.dumps(store), headers=headers)
