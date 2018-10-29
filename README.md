# Lil-Bill - Dollar Bill Classifier Mobile App

### Note: We are using the hotdog classifier app as our baseline.

# Prerequisites
Make sure you have the following installed on your machine:
* nvm (optional) - https://www.codementor.io/mercurial/how-to-install-node-js-on-macos-sierra-mphz41ekk
* node - LTS version - 8.12.0 as of 10/25/18
* npm - version 6.4.1 as of 10/25/18
* Python 2
* pip package manager - https://pip.pypa.io/en/stable/installing/
* react-native
* XCode 9 or above

# Installation Steps

If you have nvm:
```bash
nvm install --lts
nvm use --lts
```
Note:  nvm installs BOTH node and npm.

Otherwise, install npm and the LTS version of node from the node.js website.

Now, we can install react-native globally on your system

```bash
npm install -g react-native-cli
```

Now that we have installed what we need, we can train the machine learning model.

# Train the Machine Learning Model

## Downloading the Image Files

Follow the steps provided to get the images

```bash
cd coreml-training-tools/download-images
npm install
```


You can run the image downloader with the following command,
where the first parameter is the URL to a page containing links to images of hotdogs,
and the second parameter is the classification/label that you want these images to have, e.g. hotdog:

```bash
node download-imagenet-files.js http://www.image-net.org/api/text/imagenet.synset.geturls?wnid=n07697537 hotdog
```

The images will start to download and will take a couple of minutes to complete.
Eventually you’ll get an “All Done ✅” message and browsing to training_data/hotdog
will show you all of the images that have been downloaded.

## Repeat the same thing for not-hotdogs

Now we need to repeat the above steps for not-hotdogs.
As mentioned earlier we’ll use synsets of people, furniture and food for this training set.
To get the list of image URLs you can search on the ImageNet site (http://image-net.org/download), or use the URLs we’ve already found below:

```bash
node download-imagenet-files.js http://www.image-net.org/api/text/imagenet.synset.geturls?wnid=n07942152 not-hotdog
node download-imagenet-files.js http://www.image-net.org/api/text/imagenet.synset.geturls?wnid=n03842156 not-hotdog
node download-imagenet-files.js http://www.image-net.org/api/text/imagenet.synset.geturls?wnid=n00021265 not-hotdog
```

## Time to Train

We will use Apple's open sourced TuriCreate Python library to train our model.

### Install TuriCreate

Follow the next steps to install TuriCreate and train the machine learning model.

```bash
pip install virtualenv
```

Create a virtual environment called ```venv```

```bash
# Create a Python virtual environment
# Go up one directory to /coreml-training-tools and then to the train-model directory
cd ../train-model
virtualenv venv

# Activate your virtual environment
source venv/bin/activate
```

Install TuriCreate within your virtual environment
```bash
(venv) pip install -U turicreate
```

Train the model by running the following command
```bash
python train-model.py
```

Then convert to coreml:
```bash
python convert-to-coreml.py
```

This uses the training data you have downloaded in download-images/training_data and creates an ML model file.
It takes a little while to run (the time varies depending on how much data you have), but once it has completed you will have a brand new shiny model file called MyClassifier.mlmodel.
This file can be dragged straight into XCode and used in our project.
