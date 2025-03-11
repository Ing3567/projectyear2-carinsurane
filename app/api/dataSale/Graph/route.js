import {Barchart} from './Barchart'
import {Linechart} from './Linechart'
import {Piechart} from './Piechart'

export async function GET(request) {
    try {
        // Parse the query parameters from the URL
        const url = new URL(request.url);
        const type = url.searchParams.get("type");
        const data = url.searchParams.get("data");
        const time = url.searchParams.get("time");

        // Your logic based on type
        if (type === "Linechart") {
            const ans = await Linechart(data, Number(time));
            console.log(ans)
            return new Response(JSON.stringify(ans), { status: 200 });
        } else if (type === "Barchart") {
            const ans = await Barchart(data);
            console.log(ans)
            return new Response(JSON.stringify(ans), { status: 200 });
        } else if (type === "Piechart"){
            const ans = await Piechart(data);
            console.log(ans)
            return new Response(JSON.stringify(ans), { status: 200 });
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), { status: 500 });
    }
}
