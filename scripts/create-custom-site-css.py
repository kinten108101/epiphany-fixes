#!/usr/bin/env python3


from os import getcwd, makedirs
from os.path import join as joinpath, isfile


cwd = getcwd()
name = input("Name of site: ")
dirpath = joinpath(cwd, "src", "origins", name)
try:
    makedirs(dirpath)
except FileExistsError as e:
    print("error: Folder already exists")
    exit(1)

with open(joinpath(dirpath, "index.scss"), "w") as file:
    file.write("@mixin default {\n\n}\n")

with open(joinpath(dirpath, "index.js"), "w") as file:
    file.write("export default function () {\n\n}\n")
