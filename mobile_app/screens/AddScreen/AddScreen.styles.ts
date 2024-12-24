import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#EFE7EC',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 30,
        textAlign: 'center',
        color: '#6F4E7C',
    },
    button: {
        backgroundColor: '#6F4E7C',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
    },
    resultsContainer: {
        marginTop: 20,
        flex: 1,
    },
    resultsHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#6F4E7C',
    },
    vocabItem: {
        fontSize: 14,
        marginBottom: 5,
    },
    saveButton: {
        backgroundColor: '#6F4E7C',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default styles;