import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: '#EFE7EC',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#EFE7EC',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#6F4E7C',
    },
    settingsContainer: {
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#6F4E7C',
    },
    picker: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3,
    },
    saveButton: {
        backgroundColor: '#6F4E7C',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 0,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default styles;