import re

file_path = r'c:\Users\patil\OneDrive\Desktop\SIH\RAILAPP_REF\src\data\seedData.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("division: 'Pune'", "zone: 'CR', division: 'PUNE'")
content = content.replace("    name: ", "    zone: 'CR',\n    division: 'PUNE',\n    name: ")

all_india_stations = '''
  // ALL-INDIA OVERVIEW DEMO STATIONS
  { id: 'stn-ndls', code: 'NDLS', name: 'New Delhi', latitude: 28.6428, longitude: 77.2191, zone: 'NR', division: 'DELHI', routeKm: 0, isMajor: true, tracks: 16 },
  { id: 'stn-bct', code: 'BCT', name: 'Mumbai Central', latitude: 18.9696, longitude: 72.8194, zone: 'WR', division: 'MUMBAI', routeKm: 0, isMajor: true, tracks: 9 },
  { id: 'stn-hwh', code: 'HWH', name: 'Howrah Junction', latitude: 22.5833, longitude: 88.3433, zone: 'ER', division: 'HOWRAH', routeKm: 0, isMajor: true, tracks: 23 },
  { id: 'stn-mas', code: 'MAS', name: 'Chennai Central', latitude: 13.0827, longitude: 80.2707, zone: 'SR', division: 'CHENNAI', routeKm: 0, isMajor: true, tracks: 15 },
  { id: 'stn-sbc', code: 'SBC', name: 'KSR Bengaluru', latitude: 12.9781, longitude: 77.5695, zone: 'SWR', division: 'BENGALURU', routeKm: 0, isMajor: true, tracks: 10 },
  { id: 'stn-sc', code: 'SC', name: 'Secunderabad Junction', latitude: 17.4339, longitude: 78.5009, zone: 'SCR', division: 'SECUNDERABAD', routeKm: 0, isMajor: true, tracks: 10 },
  { id: 'stn-gkp', code: 'GKP', name: 'Gorakhpur', latitude: 26.7645, longitude: 83.3813, zone: 'NER', division: 'LUCKNOW', routeKm: 0, isMajor: true, tracks: 10 },
  { id: 'stn-bza', code: 'BZA', name: 'Vijayawada Junction', latitude: 16.5186, longitude: 80.6200, zone: 'SCR', division: 'VIJAYAWADA', routeKm: 0, isMajor: true, tracks: 10 },
  { id: 'stn-r', code: 'R', name: 'Raipur Junction', latitude: 21.2580, longitude: 81.6293, zone: 'SECR', division: 'RAIPUR', routeKm: 0, isMajor: true, tracks: 7 },
  { id: 'stn-bhopal', code: 'BPL', name: 'Bhopal Junction', latitude: 23.2676, longitude: 77.4140, zone: 'WCR', division: 'BHOPAL', routeKm: 0, isMajor: true, tracks: 6 },
'''

content = content.replace("  { id: 'stn-bma', code: 'BMA', name: 'Baramati', latitude: 18.1517, longitude: 74.5772, zone: 'CR', division: 'PUNE', routeKm: 118.0, isMajor: true, tracks: 3 },\n];", "  { id: 'stn-bma', code: 'BMA', name: 'Baramati', latitude: 18.1517, longitude: 74.5772, zone: 'CR', division: 'PUNE', routeKm: 118.0, isMajor: true, tracks: 3 },\n" + all_india_stations + "];")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("seedData.ts updated with Zones and Divisions.")
