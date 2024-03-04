import * as NavigationMenu from '@radix-ui/react-navigation-menu'

const AppBar = () => {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item>Testing</NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}

export default AppBar
