import styled from "@emotion/styled";
import { useRef, useState } from "react";

//emotion styled컴포넌트
const UploadContainer = styled.div`
  display: inline-block;
  cursor: pointer;
`;

const Input = styled.input`
  display: none;
`;

//상위에서 props로 필요한 정보 받아옴
const Upload = ({
  children,
  droppable,
  name,
  accept,
  value,
  onChange,
  ...props
}) => {
  // 업로드된 파일
  const [file, setFile] = useState(value);
  // 드로잉 상태 (파일을 직접 드래그해서 추가 시)
  const [dragging, setDragging] = useState(false);
  // input DOM에 직접 접근할 때 사용한다.
  const inputRef = useRef(null);

  //파일 업로드 상태 변화
  const handleFileChange = (e) => {
    const files = e.target.files;
    const changedFile = files[0];
    setFile(changedFile);
    //상위 컴포넌트에 파일 정보를 넘겨줌
    onChange && onChange(changedFile);
  };
  // DOM에 직접 접근해서 파일 선택 이벤트 발생
  const handleChooseFile = () => {
    inputRef.current.click();
  };
  // 드래그를 통해 컴포넌트 안으로 들어왔을 때
  const handleDragEnter = (e) => {
    if (!droppable) return;

    e.preventDefault(); // 브라우저 기본 이벤트를 막는다.
    e.stopPropagation(); // 부모나 자식 컴포넌트로 이벤트가 전파되는 것을 막는다.

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  };
  // 드래그를 통해 컴포넌트 밖으로 나갔을 때 overvout
  const handleDragLeave = (e) => {
    if (!droppable) return;

    e.preventDefault();
    e.stopPropagation();

    setDragging(false);
  };
  // 파일이 새창으로 열리는 것을 막기 위해
  const handleDragOver = (e) => {
    if (!droppable) return;

    e.preventDefault();
    e.stopPropagation();
  };
  // 파일을 컴포넌트 위에 놓았을 때
  const handleFileDrop = (e) => {
    if (!droppable) return;

    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    const changedFile = files[0];
    setFile(changedFile);
    onChange && onChange(changedFile);
    setDragging(false);
  };

  return (
    <UploadContainer
      onClick={handleChooseFile}
      onDrop={handleFileDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      {...props}
    >
      <Input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        onChange={handleFileChange}
      />
      {typeof children === "function" ? children(file, dragging) : children}
    </UploadContainer>
  );
};

export default Upload;