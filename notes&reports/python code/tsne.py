#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Nov 10 16:34:50 2018

@author: steven
"""


import pymatgen as mg
import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from scipy.stats import norm

import matplotlib.patheffects as pe

from sklearn.metrics import r2_score, mean_squared_error
from sklearn.preprocessing import Normalizer, StandardScaler
from sklearn.manifold import TSNE
from sklearn.decomposition import PCA


df_train = pd.read_csv('df_exp_train.csv')
df_test = pd.read_csv('df_exp_test.csv')

df_train_pred = pd.read_csv('svr_train.csv', header=None)
df_test_pred = pd.read_csv('svr_test.csv', header=None)


df = pd.concat([df_train, df_test]).reset_index(drop=True)
df['predicted'] = pd.concat([df_train_pred, df_test_pred]).reset_index(drop=True)


binned_band_gap = pd.cut(df['target'], [0,2,4,6,20])

data = df[df.columns.values[1:-1]]
data = data[data.columns.drop(list(data.filter(regex='sum')))]

columns = data.columns.values

scaler = StandardScaler()
data = scaler.fit_transform(data)

normalizer = Normalizer()
data = normalizer.fit_transform(data)

pca = PCA(n_components=10)
Xp = pca.fit_transform(data)
pca.explained_variance_

n_sne = len(df)
for i in range(1):
    tsne = TSNE(n_components=2, verbose=1, early_exaggeration=20, perplexity=20*3, n_iter=1000)
    X_tsne = tsne.fit_transform(Xp[:n_sne])
    Xf = pd.DataFrame(X_tsne)
    Xf.columns = ["comp1", "comp2"]
    Xf['labels'] = binned_band_gap[:n_sne]
#    sns.lmplot("comp1", "comp2", hue="labels", data=Xf, fit_reg=False)
    Xf['labels'] = pd.cut(df['target'], np.arange(0, 13, 2))[:n_sne]
    sns.lmplot("comp1", "comp2", hue="labels", palette="cool", data=Xf, fit_reg=False)

Xf.index = df.formula
df.index = df.formula

df_save = pd.read_csv(r'/home/steven/School/dataviscourse/dataviscourse/project/dataviscourse-pr-visualize_material_informatics/code/data/experimental_predictions.csv')
df_save.index = df_save.formula

df_save['actual'] = df['target']
df_save['predicted'] = df['predicted']
df_save['residual'] = df['target'] - df['predicted']
df_save['component_1'] = Xf['comp1']
df_save['component_2'] = Xf['comp2']

df_save['labels'] = pd.cut(df_save['actual'], np.arange(0, 13, 2))[:n_sne]
sns.lmplot("component_1", "component_2", hue="labels", palette="cool", data=df_save, fit_reg=False)


plt.plot(df_save['actual'], df_save['predicted'], 'x')
plt.plot(df_test_pred, df_test['target'], 'x')

df_save.to_csv('experimental_predictions.csv', index=False)
