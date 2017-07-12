#!/usr/bin/env python

from sgp4.earth_gravity import wgs72
from sgp4.io import twoline2rv
import os
import math

input_file_path = '../data/satellite-data/space-track-tle-last-30-days.txt'
output_file_path = '../src/assets/data/satellite-data.csv'

dir = os.path.dirname(__file__)
input_file = os.path.join(dir, input_file_path)
output_file = os.path.join(dir, output_file_path)

outfile = open(output_file, 'w')

# In the future download the satellite TLE data from space track


def generate_coords( line1, line2 ):
    satellite = twoline2rv(line1, line2, wgs72)
    position, velocity = satellite.propagate(2000, 6, 29, 12, 50, 19)

    if not (math.isnan(position[0])) and position[0] < 20000 and position[0] > -20000:

        outfile.write(str(int(position[0])) + ',' + str(int(position[1])) + ',' + str(int(position[2])) + '\n')


with open(input_file) as satellite_data:
    while True:
        line1 = satellite_data.readline()
        line2 = satellite_data.readline()
        if not line1: break
        generate_coords( line1, line2 )

satellite_data.close()
outfile.close()