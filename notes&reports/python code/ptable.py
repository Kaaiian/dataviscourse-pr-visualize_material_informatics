# -*- coding: utf-8 -*-
"""
Created on Sat Nov  3 13:37:22 2018

@author: Kaai
"""

import pandas as pd
import numpy as np
import pymatgen as mg

import os, os.path as path
two_up = path.abspath(path.join(os.getcwd(),"../.."))

df_ptable = pd.read_csv(two_up + '/code/data/ptable.csv')
df_data = pd.read_csv(two_up + '/code/data/experimental_predictions.csv')

df_data.index = df_data['formula']
df_ptable.index = df_ptable['symbol']
# %%
#avg_res = {}
#avg_pred = {}
#avg_act = {}
#elem_count = {}
#for element in df_ptable['symbol']:
#    i = 0
#    avg_res[element] = 0
#    avg_pred[element] = 0
#    avg_act[element] = 0
#    for formula in df_data.index.values:
#        if element in df_data.loc[formula, 'elements']:
#            i += 1
#            avg_res[element] += df_data.loc[formula, 'residual']
#            avg_pred[element] += df_data.loc[formula, 'actual']
#            avg_act[element] += df_data.loc[formula, 'predicted']
#    if i != 0:
#        avg_res[element] = avg_res[element]/i
#        avg_pred[element] = avg_pred[element]/i
#        avg_act[element] = avg_act[element]/i
#    elem_count[element] = i
#
#avg_res = pd.Series(avg_res)
#avg_pred = pd.Series(avg_pred)
#avg_act = pd.Series(avg_act)
#
#count = pd.Series(elem_count)
#
#df_ptable['count'] = count
#df_ptable['average_residual'] = avg_res
#df_ptable['average_predicted'] = avg_pred
#df_ptable['average_actual'] = avg_act
#
#df_ptable.to_csv(two_up + '/code/data/ptable.csv', index=False)

# %%
# bin the residual values

for element in df_ptable['symbol']:
    try:
        df_elem = df_data[df_data['elements'].str.contains("'" + element + "'")]
    #    df_elem.to_csv(two_up + '/code/data/element_data/'+element+'.csv', index=False)
    
        bins = np.linspace(df_elem['residual'].min(), df_elem['residual'].max()+0.001, 21)
        df_elem['bin_number'] = pd.cut(df_elem['residual'], 20, labels=list(np.arange(0, 20, 1)))
        df_elem['bin_range'] = pd.cut(df_elem['residual'], bins)
        df_elem_hist = pd.DataFrame()
        df_elem_hist['bin_count'] = df_elem['bin_number'].value_counts().values
        df_elem_hist['bin_freq'] = df_elem_hist['bin_count']/len(df_elem)
        df_elem_hist['bin_range'] = df_elem['bin_range'].value_counts().index.values
        df_elem_hist['bin_number'] = df_elem['bin_number'].value_counts().index.values
    
        df_elem_hist.to_csv(two_up + '/code/data/hist_data/'+element+'_hist.csv', index=False)
    except:
        df_elem_hist = pd.DataFrame()
        df_elem_hist['bin_count'] = np.zeros(20)
        df_elem_hist['bin_freq'] = np.zeros(20)
        df_elem_hist['bin_range'] = pd.cut(pd.Series(np.linspace(-4.99, 5+0.001, 20)), np.linspace(-5, 5+0.001, 21))
        df_elem_hist['bin_number'] = pd.cut(pd.Series(np.linspace(-4.99, 5+0.001, 20)), 20, labels=list(np.arange(0, 20, 1)))
        df_elem_hist.to_csv(two_up + '/code/data/hist_data/'+element+'_hist.csv', index=False)
