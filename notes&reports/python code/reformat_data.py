#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Nov  6 20:57:02 2018

@author: steven
"""


import pandas as pd
import numpy as np
import pymatgen as mg

import os, os.path as path
two_up = path.abspath(path.join(os.getcwd(),"../.."))

element_data = os.listdir(two_up+'/code/data/element_data')

for element_sheet in element_data:
    df = pd.read_csv(two_up+'/code/data/element_data/' + element_sheet)
    df['elements'] = df['elements'].str.replace('[', '')
    df['elements'] = df['elements'].str.replace(']', '')
    df['elements'] = df['elements'].str.replace(',', '')
    df['elements'] = df['elements'].str.replace("'", '')
    df.to_csv(two_up+'/code/data/element_data/' + element_sheet, index=False)
