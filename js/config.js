/**
 * Configuration Object
 * Contains emission factors, transport mode metadata, carbon credit info,
 * and utility methods for setting up the calculator UI
 */

const CONFIG = {
    /**
     * CO2 emission factors in kg per kilometer for each transport mode
     */
    EMISSION_FACTORS: {
        bicycle: 0,
        car: 0.12,
        bus: 0.089,
        truck: 0.96
    },

    /**
     * Transport mode metadata for UI display
     */
    TRANSPORT_MODES: {
        bicycle: {
            label: "Bicicleta",
            icon: "🚲",
            color: "#10b981"
        },
        car: {
            label: "Carro",
            icon: "🚗",
            color: "#3b82f6"
        },
        bus: {
            label: "Ônibus",
            icon: "🚌",
            color: "#f59e0b"
        },
        truck: {
            label: "Caminhão",
            icon: "🚚",
            color: "#ef4444"
        }
    },

    /**
     * Carbon credit information
     */
    CARBON_CREDIT: {
        KG_PER_CREDIT: 1000,
        PRICE_MIN_BRL: 50,
        PRICE_MAX_BRL: 150
    },

    /**
     * Populate the cities datalist with available cities from the routes database
     */
    populateDatalist: function() {
        // Get all cities from the routes database
        const cities = RoutesDB.getAllCities();
        
        // Get the datalist element
        const datalist = document.getElementById('cities-list');
        
        // Create and append option elements for each city
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            datalist.appendChild(option);
        });
    },

    /**
     * Set up automatic distance calculation based on selected cities
     * Handles route lookup and manual distance override
     */
    setupDistanceAutofill: function() {
        // Get form elements
        const originInput = document.getElementById('origin');
        const destinationInput = document.getElementById('destination');
        const distanceInput = document.getElementById('distance');
        const manualCheckbox = document.getElementById('manual-distance');
        const helperText = distanceInput.nextElementSibling;
        
        /**
         * Try to find and fill distance for current origin/destination
         */
        const tryFindDistance = () => {
            // Get trimmed values
            const origin = originInput.value.trim();
            const destination = destinationInput.value.trim();
            
            // Only proceed if both inputs are filled
            if (origin && destination) {
                // Try to find distance in database
                const distance = RoutesDB.findDistance(origin, destination);
                
                if (distance !== null) {
                    // Distance found - fill input and set as readonly
                    distanceInput.value = distance;
                    distanceInput.readOnly = true;
                    
                    // Update helper text with success message
                    helperText.textContent = '✓ Distância encontrada automaticamente';
                    helperText.style.color = '#10b981';
                } else {
                    // Distance not found - clear input and suggest manual entry
                    distanceInput.value = '';
                    helperText.textContent = 'Rota não encontrada. Por favor, marque a opção para inserir manualmente.';
                    helperText.style.color = '#ef4444';
                }
            }
        };
        
        // Add change event listeners to origin and destination inputs
        originInput.addEventListener('change', tryFindDistance);
        destinationInput.addEventListener('change', tryFindDistance);
        
        // Handle manual distance checkbox
        manualCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Allow manual entry
                distanceInput.readOnly = false;
                distanceInput.focus();
                helperText.textContent = 'Insira a distância manualmente';
                helperText.style.color = '#6b7280';
            } else {
                // Try to find route automatically again
                helperText.textContent = 'A distância será preenchida automaticamente';
                helperText.style.color = '#6b7280';
                tryFindDistance();
            }
        });
    }
};
