function navigateToTrip() {
    var dropdown = document.getElementById('datesDropdown');
    var selectedValue = dropdown.options[dropdown.selectedIndex].value;
    if (selectedValue) {
        window.location.href = selectedValue;
    }
}