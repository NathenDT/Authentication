import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'

const WrapperBox = styled(Stack)(({ theme }) => ({
  display: 'flex',
  height: '100%',
  padding: 1,
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
  [theme.breakpoints.up('sm')]: {
    width: '600px',
  },
}))

export default WrapperBox
