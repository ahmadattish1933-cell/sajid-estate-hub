```javascript
"use strict";

/* =====================================================
   FETCH GROUP OF COMPANIES (PVT.) LTD.
   PROPERTY WEBSITE - JAVASCRIPT
===================================================== */


/* =====================================================
   1. AUTOMATIC COPYRIGHT YEAR
===================================================== */

const currentYearElement = document.getElementById("currentYear");

if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}


/* =====================================================
   2. SELECT HTML ELEMENTS
===================================================== */

const propertySearchForm = document.getElementById("propertySearchForm");

const propertyTypeInput = document.getElementById("propertyType");

const propertyLocationInput = document.getElementById("propertyLocation");

const propertySizeInput = document.getElementById("propertySize");

const priceRangeInput = document.getElementById("priceRange");

const propertyCards = document.querySelectorAll(".property-card");

const filterButtons = document.querySelectorAll(".filter-btn");


/* =====================================================
   3. PROPERTY FILTER VARIABLES
===================================================== */

let selectedCategory = "all";


/* =====================================================
   4. CONVERT PRICE TEXT INTO A NUMBER
===================================================== */

function getPropertyPrice(card) {

    /*
       Har property card mein data-price attribute use hoga.

       Example:
       data-price="4500000"

       Is ka matlab:
       45 lakh rupees.
    */

    const price = Number(card.dataset.price);

    if (!Number.isFinite(price) || price <= 0) {
        return null;
    }

    return price;
}


/* =====================================================
   5. GET PROPERTY SIZE
===================================================== */

function getPropertySize(card) {

    /*
       Har property card mein data-size attribute use hoga.

       Example:
       data-size="5-marla"
    */

    return (card.dataset.size || "").trim().toLowerCase();
}


/* =====================================================
   6. PRICE RANGE CHECK
===================================================== */

function matchesPriceRange(price, selectedRange) {

    /*
       Agar price maloom nahi hai to property ko
       price filter mein match nahi samjha jayega.
    */

    if (price === null) {
        return false;
    }


    if (!selectedRange) {
        return true;
    }


    switch (selectedRange) {

        case "under-50-lakh":

            return price < 5000000;


        case "50-lakh-1-crore":

            return price >= 5000000 && price <= 10000000;


        case "1-2-crore":

            return price > 10000000 && price <= 20000000;


        case "above-2-crore":

            return price > 20000000;


        default:

            return true;
    }

}


/* =====================================================
   7. PROPERTY SEARCH AND FILTER FUNCTION
===================================================== */

function filterProperties() {

    if (propertyCards.length === 0) {
        return;
    }


    /*
       User ki selected values hasil karein.
    */

    const selectedType = propertyTypeInput
        ? propertyTypeInput.value.trim().toLowerCase()
        : "";


    const selectedLocation = propertyLocationInput
        ? propertyLocationInput.value.trim().toLowerCase()
        : "";


    const selectedSize = propertySizeInput
        ? propertySizeInput.value.trim().toLowerCase()
        : "";


    const selectedPriceRange = priceRangeInput
        ? priceRangeInput.value.trim()
        : "";


    let visibleCount = 0;


    /*
       Har property card ko check karein.
    */

    propertyCards.forEach(function (card) {

        const cardType = (card.dataset.type || "")
            .trim()
            .toLowerCase();


        const cardLocation = (card.dataset.location || "")
            .trim()
            .toLowerCase();


        const cardSize = getPropertySize(card);

        const cardPrice = getPropertyPrice(card);


        /*
           1. Property type check
        */

        const matchesType =
            !selectedType || cardType === selectedType;


        /*
           2. Location check
        */

        const matchesLocation =
            !selectedLocation ||
            cardLocation === selectedLocation;


        /*
           3. Size check

           "other" ka option un sizes ke liye hai
           jo pehle se diye gaye options mein nahi.
        */

        let matchesSize = true;


        if (selectedSize === "other") {

            const commonSizes = [
                "3-marla",
                "5-marla",
                "10-marla",
                "1-kanal"
            ];

            matchesSize =
                cardSize !== "" &&
                !commonSizes.includes(cardSize);

        } else if (selectedSize) {

            matchesSize = cardSize === selectedSize;

        }


        /*
           4. Price check
        */

        const matchesPrice = matchesPriceRange(
            cardPrice,
            selectedPriceRange
        );


        /*
           5. Category button check
        */

        const matchesCategory =
            selectedCategory === "all" ||
            cardType === selectedCategory;


        /*
           Sab conditions match hon to property dikhayein.
        */

        const shouldShow =
            matchesType &&
            matchesLocation &&
            matchesSize &&
            matchesPrice &&
            matchesCategory;


        card.hidden = !shouldShow;


        if (shouldShow) {
            visibleCount++;
        }

    });


    /*
       Result message update karein.
    */

    updateSearchMessage(visibleCount);

}


/* =====================================================
   8. SHOW SEARCH RESULT MESSAGE
===================================================== */

function updateSearchMessage(count) {

    let messageElement = document.getElementById(
        "propertySearchMessage"
    );


    /*
       Agar message element HTML mein nahi hai,
       to JavaScript usay khud banayegi.
    */

    if (!messageElement) {

        messageElement = document.createElement("p");

        messageElement.id = "propertySearchMessage";

        messageElement.className = "form-message";

        messageElement.setAttribute("role", "status");

        messageElement.setAttribute("aria-live", "polite");


        const searchSection = document.querySelector(
            ".property-search-form"
        );


        if (searchSection) {

            searchSection.insertAdjacentElement(
                "afterend",
                messageElement
            );

        } else {

            return;

        }

    }


    if (count === 0) {

        messageElement.textContent =
            "No matching properties found. Please change your search filters.";

    } else {

        messageElement.textContent =
            count + " matching propert" +
            (count === 1 ? "y" : "ies") +
            " found.";

    }

}


/* =====================================================
   9. PROPERTY SEARCH FORM
===================================================== */

if (propertySearchForm) {

    propertySearchForm.addEventListener(
        "submit",
        function (event) {

            /*
               Form submit hone par page reload nahi hoga.
            */

            event.preventDefault();


            /*
               Search function chalayen.
            */

            filterProperties();


            /*
               User ko properties ki taraf le jayein.
            */

            const propertiesSection = document.getElementById(
                "properties"
            );


            if (propertiesSection) {

                propertiesSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );

}


/* =====================================================
   10. PROPERTY CATEGORY BUTTONS
===================================================== */

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        /*
           Pehle sab buttons se active class remove karein.
        */

        filterButtons.forEach(function (item) {

            item.classList.remove("active");

        });


        /*
           Click kiye gaye button ko active banayein.
        */

        button.classList.add("active");


        /*
           Selected category hasil karein.
        */

        selectedCategory = (
            button.dataset.filter || "all"
        ).toLowerCase();


        /*
           Properties dobara filter karein.
        */

        filterProperties();

    });

});


/* =====================================================
   11. PROPERTY INQUIRY FORM
===================================================== */

const propertyInquiryForm = document.getElementById(
    "propertyInquiryForm"
);


if (propertyInquiryForm) {

    propertyInquiryForm.addEventListener(
        "submit",
        function (event) {

            /*
               Default page reload rokein.
            */

            event.preventDefault();


            /*
               Form fields hasil karein.
            */

            const customerName = document.getElementById(
                "customerName"
            );


            const customerPhone = document.getElementById(
                "customerPhone"
            );


            const customerEmail = document.getElementById(
                "customerEmail"
            );


            const inquiryPropertyType = document.getElementById(
                "inquiryPropertyType"
            );


            const customerBudget = document.getElementById(
                "customerBudget"
            );


            const customerMessage = document.getElementById(
                "customerMessage"
            );


            const formMessage = document.getElementById(
                "formMessage"
            );


            /*
               Fields ki values hasil karein.
            */

            const name = customerName.value.trim();

            const phone = customerPhone.value.trim();

            const email = customerEmail.value.trim();

            const propertyType = inquiryPropertyType.value;

            const budget = customerBudget.value;

            const message = customerMessage.value.trim();


            /*
               Required fields check karein.
            */

            if (
                !name ||
                !phone ||
                !propertyType ||
                !budget
            ) {

                formMessage.textContent =
                    "Please complete all required fields.";

                return;

            }


            /*
               Phone number ki basic validation.
               International aur Pakistani formats accept karein.
            */

            const phoneDigits = phone.replace(/\D/g, "");


            if (phoneDigits.length < 10 || phoneDigits.length > 15) {

                formMessage.textContent =
                    "Please enter a valid phone number.";

                customerPhone.focus();

                return;

            }


            /*
               Email diya gaya ho to us ka basic format check karein.
            */

            if (email) {

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (!emailPattern.test(email)) {

                    formMessage.textContent =
                        "Please enter a valid email address.";

                    customerEmail.focus();

                    return;

                }

            }


            /*
               WhatsApp message tayyar karein.
            */

            const whatsappMessage =

                "Hello Fetch Group of Companies!" +

                "\n\nI am interested in your property services." +

                "\n\nCustomer Name: " + name +

                "\nPhone Number: " + phone +

                "\nEmail: " + (email || "Not provided") +

                "\nProperty Type: " + propertyType +

                "\nBudget: " + budget +

                "\nAdditional Requirements: " +
                (message || "Not provided");


            /*
               Company ka WhatsApp number.
               Pakistan country code ke sath 92 use hota hai.
            */

            const companyWhatsAppNumber = "923104443759";


            /*
               WhatsApp URL banayein.
            */

            const whatsappURL =
                "https://wa.me/" +
                companyWhatsAppNumber +
                "?text=" +
                encodeURIComponent(whatsappMessage);


            /*
               User ko WhatsApp par bhejne se pehle
               confirmation message dikhayein.
            */

            formMessage.textContent =
                "Your details are ready. WhatsApp will open so you can send your inquiry.";


            /*
               WhatsApp new tab mein open karein.
            */

            const whatsappWindow = window.open(
                whatsappURL,
                "_blank",
                "noopener,noreferrer"
            );


            /*
               Agar browser ne new tab block kar diya ho,
               to current tab mein WhatsApp khol dein.
            */

            if (!whatsappWindow) {

                window.location.href = whatsappURL;

            }

        }
    );

}


/* =====================================================
   12. PROPERTY WHATSAPP LINKS
===================================================== */

const propertyWhatsAppButtons = document.querySelectorAll(
    ".property-card .btn-property"
);


propertyWhatsAppButtons.forEach(function (button) {

    button.addEventListener("click", function (event) {

        /*
           Property card se details hasil karein.
        */

        const card = button.closest(".property-card");


        if (!card) {
            return;
        }


        const propertyTitle = card.querySelector("h3");

        const propertyLocation = card.querySelector(
            ".property-location"
        );

        const propertyPrice = card.querySelector(
            ".property-price h4"
        );


        const title = propertyTitle
            ? propertyTitle.textContent.trim()
            : "Property";


        const location = propertyLocation
            ? propertyLocation.textContent.trim()
            : "Lahore";


        const price = propertyPrice
            ? propertyPrice.textContent.trim()
            : "Price not provided";


        /*
           Agar property ki asal price abhi add nahi ki gayi,
           to user ko ghalat price message na bhejein.
        */

        const inquiryText =

            "Hello Fetch Group of Companies!" +

            "\n\nI am interested in this property." +

            "\nProperty: " + title +

            "\nLocation: " + location +

            "\nPrice: " + price;


        /*
           HTML ke purane WhatsApp message ko
           property-specific message se replace karein.
        */

        const whatsappURL =

            "https://wa.me/923104443759?text=" +

            encodeURIComponent(inquiryText);


        /*
           Anchor ke default action ko rok kar
           naya URL kholein.
        */

        event.preventDefault();


        const whatsappWindow = window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );


        if (!whatsappWindow) {

            window.location.href = whatsappURL;

        }

    });

});


/* =====================================================
   13. INITIALIZE WEBSITE
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /*
       Page load par initial properties dikhayein.
    */

    filterProperties();

});


/* =====================================================
   JAVASCRIPT COMPLETE
===================================================== */
```
