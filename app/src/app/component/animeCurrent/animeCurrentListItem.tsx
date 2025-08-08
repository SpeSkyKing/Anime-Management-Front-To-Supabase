import { ICurrentAnime } from "../data/interface";
import { AnimeCurrentListItemProps } from "../data/props";
export const AnimeCurrentListItem : React.FC<AnimeCurrentListItemProps> = ({currentAnime,onclick,onFinish}) => {
    const releaseDate = currentAnime.releasedate;

    const currentDate = new Date();

    const colorMap = {
        Monday: "bg-blue-500", 
        Tuesday: "bg-green-400",
        Wednesday: "bg-pink-300",
        Thursday: "bg-orange-400",
        Friday: "bg-yellow-300", 
        Saturday: "bg-red-500", 
        Sunday: "bg-teal-300",
      };


    let deliveryWeeday = "";
    let stateBgColorClass = "";
    switch(currentAnime.delivery_weekday){
        case "1":
            deliveryWeeday = "月";
            stateBgColorClass = colorMap['Monday']; 
        break;
        case "2":
            deliveryWeeday = "火";
            stateBgColorClass = colorMap['Tuesday']; 
        break;
        case "3":
            deliveryWeeday = "水";
            stateBgColorClass = colorMap['Wednesday']; 
        break;
        case "4":
            deliveryWeeday = "木";
            stateBgColorClass = colorMap['Thursday']; 
        break;
        case "5":
            deliveryWeeday = "金";
            stateBgColorClass = colorMap['Friday']; 
        break;
        case "6":
            deliveryWeeday = "土";
            stateBgColorClass = colorMap['Saturday']; 
        break;
        case "7":
            deliveryWeeday = "日";
            stateBgColorClass = colorMap['Sunday']; 
        break;
    }

    const onEpisodeUp = () => {
        onclick(currentAnime);
    }

    const onFinishAnime = () => {
        onFinish(currentAnime);
    }

    const getExpectedEpisodes = (delivery:string) => {
        const releaseDateTime = new Date(`${releaseDate}T${delivery}`);
        const diffInMilliseconds = currentDate.getTime() - releaseDateTime.getTime();
        const diffInWeeks = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 7));

        return diffInWeeks + 1;
    };

    const getRowStyle = (currentAnime:ICurrentAnime) => {
        const { delivery_time:delivery, anime:animeInfo } = currentAnime;
        const expectedEpisodes = getExpectedEpisodes(delivery);

        if (expectedEpisodes > animeInfo.episode) {
            return {
                bgColor: 'bg-gray-300',
                borderClass: 'border-4 border-red-800',
                fontWeight: 'font-bold'
            };
        }else{
            return {
                bgColor: '',
                borderClass: '',
                fontWeight: ''
            };
        }
    };

    const rowStyle = getRowStyle(currentAnime);

    const formatAnimeName = (name: string) => {
        if (window.innerWidth >= 768) return name; // Web版では区切らない
        if (name.length <= 10) return name;
        const chunks = [];
        for (let i = 0; i < name.length; i += 10) {
            chunks.push(name.slice(i, i + 10));
        }
        return chunks.join('\n');
    };
    const animeName = formatAnimeName(currentAnime.anime.anime_name);

    return (
        <tr className={`bg-white hover:bg-gray-100 ${rowStyle.bgColor} ${rowStyle.borderClass} ${rowStyle.fontWeight}`}>
            <td className="!text-black px-1 py-1 text-xs md:text-base whitespace-pre md:whitespace-nowrap">{animeName}</td>
            {/* <td className="!text-black px-1 py-1 text-center text-xs whitespace-nowrap">{releaseDate}</td> */}
            <td className={`!text-black px-1 py-1 text-center text-xs md:text-base whitespace-nowrap ${stateBgColorClass}`}>{deliveryWeeday}</td>
            <td className="!text-black px-1 py-1 text-center text-xs md:text-base whitespace-nowrap">{currentAnime.delivery_time.slice(0, 5)}</td>
            <td className="!text-black px-1 py-1 text-center text-xs md:text-base whitespace-nowrap">{currentAnime.anime.episode}話</td>
            <td className="!text-black px-1 py-1 text-center whitespace-nowrap">
                <div className="flex flex-col md:flex-row gap-1 md:gap-4 md:justify-center">
                    <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white text-xs py-1 px-2 md:w-24 md:h-16 md:text-base rounded"
                        onClick={onEpisodeUp}>
                    視聴
                    </button>
                    <button 
                        className="bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2 md:w-24 md:h-16 md:text-base rounded"
                        onClick={onFinishAnime}>
                    終了
                    </button>
                </div>
            </td>
        </tr>
    );
};
