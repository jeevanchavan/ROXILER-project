import { useState, useCallback } from 'react';
import {
    getDashboardData,
    getAllUsers,
    getUserById,
    createUser,
    getAllStores,
    createStore
} from '../service/admin.api';

export const useAdmin = () => {
    const [dashboard, setDashboard] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [users, setUsers] = useState([]);
    const [userDetails, setUserDetails] = useState(null);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getDashboardData();
            if (data?.data) {
                setDashboard({
                    totalUsers: data.data.totalUsers || 0,
                    totalStores: data.data.totalStores || 0,
                    totalRatings: data.data.totalRatings || 0,
                });
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch dashboard data.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const userList = await getAllUsers();
            setUsers(userList);
            return userList;
        } catch (err) {
            setError(err.message || 'Failed to fetch users.');
            setUsers([]);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUserById = useCallback(async (id) => {
        setLoading(true);
        setError('');
        try {
            const user = await getUserById(id);
            setUserDetails(user);
            return user;
        } catch (err) {
            setError(err.message || 'Failed to fetch user details.');
            setUserDetails(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const addUser = async (userData) => {
        setLoading(true);
        setError('');
        try {
            const response = await createUser(userData);
            await fetchUsers(); // Refresh list after adding
            return response;
        } catch (err) {
            setError(err.message || 'Failed to add user.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchStores = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const storeList = await getAllStores();
            setStores(storeList);
            return storeList;
        } catch (err) {
            setError(err.message || 'Failed to fetch stores.');
            setStores([]);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const addStore = async (storeData) => {
        setLoading(true);
        setError('');
        try {
            const response = await createStore(storeData);
            await fetchStores(); // Refresh list after adding
            return response;
        } catch (err) {
            setError(err.message || 'Failed to add store.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        dashboard,
        users,
        userDetails,
        stores,
        loading,
        error,
        setError,
        fetchDashboard,
        fetchUsers,
        fetchUserById,
        addUser,
        fetchStores,
        addStore
    };
};
