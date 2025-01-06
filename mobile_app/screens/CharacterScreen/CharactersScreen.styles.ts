import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFE7EC',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#EFE7EC',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#6F4E7C',
        marginBottom: 10,
    },
    sectionHeader: {
        backgroundColor: '#DDD',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    sectionHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6F4E7C',
    },
    characterBox: {
        backgroundColor: '#FFF',
        margin: 5,
        borderRadius: 8,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2, // For Android shadow
    },
    characterText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6F4E7C',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#6F4E7C',
    },
    modalPingyin: {
        fontSize: 18,
        color: "#333",
        marginBottom: 5,
    },
    modalDefinition: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    modalPhrase: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    modalSets: {
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
        color: '#6F4E7C',
    },
    closeButton: {
        backgroundColor: '#E63946',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyMessage: {
        textAlign: 'center',
        color: '#6F4E7C',
        marginTop: 20,
    },
});

export default styles;
