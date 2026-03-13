import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        
        // Only fetch if we haven't already loaded jobs or if search query changes
        fetchAllJobs();
    }, [searchedQuery, dispatch]);

    return { loading };
}

export default useGetAllJobs