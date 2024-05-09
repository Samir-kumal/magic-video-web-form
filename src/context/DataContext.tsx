import axios from "axios";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
export interface DataContextProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  updatePage: (value: PageAction) => void;
  shouldGoNext: boolean;
  setShouldGoNext: React.Dispatch<React.SetStateAction<boolean>>;
  selectedVideo: VideoProps | null;
  setSelectedVideo: React.Dispatch<React.SetStateAction<VideoProps | null>>;
  testUser: string;
  setTestUser: React.Dispatch<React.SetStateAction<string>>;
  uploadedVideo: File | null;
  setUploadedVideo: React.Dispatch<React.SetStateAction<File | null>>;
  selectedSubjectId: string;
  setSelectedSubjectId: React.Dispatch<React.SetStateAction<string>>;
  videosSubjects: VideoSubjectsProps[] | null;
  setVideosSubjects: React.Dispatch<
    React.SetStateAction<VideoSubjectsProps[] | null>
  >;
}

export const DataContext = createContext<DataContextProps | null>(null);
export enum PageAction {
  NEXT = "NEXT",
  PREVIOUS = "PREVIOUS",
}

export interface DataProviderProps {
  children: React.ReactNode;
}

export interface VideoProps {
  download_url: string;
  filename: string;
  filepath: string;
  subject_id: string;
  subject_name: string;
  video_id: string;
}
export interface VideoSubjectsProps {
  subject_id: string;
  subject_name: string;
}
// export const BASE_URL = "http://192.168.1.151:5001";
export const BASE_URL = "http://192.168.1.143:5001";


const DataProvider = ({ children }: DataProviderProps) => {
  const [page, setPage] = useState(1);
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoProps | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [testUser, setTestUser] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [videosSubjects, setVideosSubjects] = useState<
    VideoSubjectsProps[] | null
  >(null);

  const updatePage = (value: PageAction) => {
    if (value === PageAction.PREVIOUS) {
      setPage((prev) => (prev === 1 ? 1 : prev - 1));
    } else {
      setPage((prev) => (prev === 5 ? 5 : prev + 1));
      setShouldGoNext(false);
    }
  };

  useEffect(() => {
    if (videosSubjects === null) {
      getSubjectList();
    }
  }, []);
  const getSubjectList = useCallback(async () => {
    try {
      const result = await axios.get(`${BASE_URL}/api/subjects`);
      console.log(result.data);
      setVideosSubjects(result.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const value = useMemo(
    () => ({
      page,
      setPage,
      updatePage,
      shouldGoNext,
      setShouldGoNext,
      selectedVideo,
      setSelectedVideo,
      testUser,
      setTestUser,
      uploadedVideo,
      setUploadedVideo,
      selectedSubjectId,
      setSelectedSubjectId,
      videosSubjects,
      setVideosSubjects,
    }),
    [
      page,
      setPage,
      updatePage,
      shouldGoNext,
      setShouldGoNext,
      selectedVideo,
      setSelectedVideo,
      testUser,
      setTestUser,
      uploadedVideo,
      setUploadedVideo,
      selectedSubjectId,
      setSelectedSubjectId,
      videosSubjects,
      setVideosSubjects,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;
