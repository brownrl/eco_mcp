#!/bin/bash

# ECL Assets Download Script
# Downloads all necessary ECL assets for local development

set -e

ECL_VERSION="4.11.1"
BASE_URL="https://cdn1.fpfis.tech.ec.europa.eu/ecl/v${ECL_VERSION}/ec"

echo "Downloading ECL v${ECL_VERSION} assets..."

# Create directory structure
mkdir -p assets/css
mkdir -p assets/js
mkdir -p assets/icons
mkdir -p assets/images/logo/positive
mkdir -p assets/images/logo/negative

# Download CSS files
echo "Downloading CSS files..."
curl -o assets/css/ecl-reset.css "${BASE_URL}/styles/optional/ecl-reset.css"
curl -o assets/css/ecl-ec.css "${BASE_URL}/styles/ecl-ec.css"
curl -o assets/css/ecl-ec-utilities.css "${BASE_URL}/styles/optional/ecl-ec-utilities.css"
curl -o assets/css/ecl-ec-print.css "${BASE_URL}/styles/optional/ecl-ec-print.css"

# Download JavaScript
echo "Downloading JavaScript files..."
curl -o assets/js/ecl-ec.js "${BASE_URL}/scripts/ecl-ec.js"

# Download icon sprite
echo "Downloading icon sprites..."
curl -o assets/icons/icons.svg "${BASE_URL}/images/icons/sprites/icons.svg"
curl -o assets/icons/icons-social-media.svg "https://ec.europa.eu/component-library/dist/media/icons-social-media.32dd05ab.svg"

# Try to download flag icons if they exist
echo "Attempting to download flag icons..."
if curl -f -o assets/icons/icons-flag.svg "https://ec.europa.eu/component-library/dist/media/icons-flag.53077945.svg" 2>/dev/null; then
    echo "Flag icons downloaded successfully!"
else
    echo "Flag icons not available or failed to download."
fi

# Download logos
echo "Downloading logos..."
curl -o assets/icons/logo-ec.svg "${BASE_URL}/images/logo/positive/logo-ec--en.svg"
curl -o assets/icons/logo-ec-negative.svg "${BASE_URL}/images/logo/negative/logo-ec--en.svg"

# Download additional common logos
curl -o assets/images/logo/positive/logo-ec--mute.svg "${BASE_URL}/images/logo/positive/logo-ec--mute.svg"
curl -o assets/images/logo/negative/logo-ec--mute.svg "${BASE_URL}/images/logo/negative/logo-ec--mute.svg"

echo "Download complete!"
echo "Assets downloaded to assets/ directory"