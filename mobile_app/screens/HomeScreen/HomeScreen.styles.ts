import { StyleSheet } from "react-native";
import {COLORS} from '../../constants/colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFE7EC', // Light sort purple/white background color
        padding: 20,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#6F4E7C', // Soft Purple
        marginTop: 40,
    },
    streakContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    streakNumber: {
        fontSize: 80,
        fontWeight: 'bold',
        color: '#6F4E7C', // Soft purple
    },
    streakLabel: {
        fontSize: 18,
        color: '#6F4E7C',
        marginTop: 5,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#6F4E7C', // Soft Purple
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    topSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6F4E7C', // Soft purple color
    },
    bottomSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    libraryHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6F4E7C', // Soft Purple Color
        marginBottom: 10,
    },
    placeholder: {
        fontSize: 16,
        color: '#aaa',
    },
});

export default styles;