// import React, { useEffect, useState } from 'react';
// import ArgoApiService from './ArgoApiService';

// const ArgoComponent = () => {
//   const [workflowList, setWorkflowList] = useState([]);
//   const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ik9oUHM2QzFPeVdZRDQ2dU5UNWRPb2hOMmtXSkdpVVc3NlBSTjhDMGJ6OGMifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJhcmdvLXRlc3QiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlY3JldC5uYW1lIjoiZGVmYXVsdC5zZXJ2aWNlLWFjY291bnQtdG9rZW4iLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiZGVmYXVsdCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjBjNWEwNmIzLTBkMWMtNGMyMC1iM2I5LTM1ZWZlYzZiYjIzOSIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDphcmdvLXRlc3Q6ZGVmYXVsdCJ9.APz81EY71lpPdbzoK2pJ6YCgAGm_OYCfL-ERZlBu1-y6cf4i0VQmXoDAfBi_T7xcU4LWe6leQx1J5C_fdyGKJ1p_gBFIbba1eLUAyAUaCitXTl2wULL5lg6JG0X7EUoKe_uFMWthFnhru-XShqmbiNo44A8d0XTwZN8M-9CxiA-5FrKTPJHNgygV0JvnzLCV8xGqUMVVEGpyJBZdiEobIfEvDZGNo95QdVAXyqsMSsRJHMdw023hS_KXlA8IcowK4OqcL_BqbuVoa2OY04-R-S48YZk8EfrogM4Qq-r7MVpoeuUGG7AOEsxWn8yFcES5jssPR28wa4DPx_Ku0DTE4Q'; // 가져온 토큰을 여기에 넣으세요

//   useEffect(() => {
//     // Argo API 호출
//     ArgoApiService(token)
//       .then(response => {
//         // API 응답에서 필요한 정보 추출하여 상태 업데이트
//         setWorkflowList(response.data.items);
//       })
//       .catch(error => {
//         console.error('Error fetching Argo API:', error);
//       });
//     console.log(setWorkflowList)
//   }, []);

//   return (
//     <div>
//       <h3>Argo Workflow List</h3>
//       <ul>
//         {workflowList.map(workflow => (
//           <li key={workflow.metadata.uid}>{workflow.metadata.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ArgoComponent;