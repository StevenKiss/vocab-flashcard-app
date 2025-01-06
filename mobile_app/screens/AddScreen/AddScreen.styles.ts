import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#EFE7EC',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#EFE7EC',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
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
    textInput: {
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: 10,
        padding: 12,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: '#FFF',
        color: '#6F4E7C',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E63946',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 40,
        flex: 1,
        marginEnd: 10,
    },
    cancelButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 5,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A9D8F',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 10,
        flex: 1,
        marginStart: 10,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 5,
    },
});

export default styles;