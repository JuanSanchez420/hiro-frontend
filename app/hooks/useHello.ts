import { useEffect } from "react";

const useHello = () => {
    useEffect(() => {
        const f = async () => {
            const response = await fetch(`/api/hello`, { credentials: 'include', });
            const data = await response.json();
            console.log(data);
        }
        f();
    }, []);
}

export default useHello;