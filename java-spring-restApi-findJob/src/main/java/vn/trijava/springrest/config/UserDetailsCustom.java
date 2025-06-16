//package vn.trijava.springrest.config;
//
//import java.util.Collections;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Component;
//import vn.trijava.springrest.service.UserService;
//
//@Component("userDetailsService")
//public class UserDetailsCustom implements UserDetailsService {
//
//    private final UserService userService;
//
//    public UserDetailsCustom(UserService userService) {
//        this.userService = userService;
//    }
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        vn.trijava.springrest.domain.User user = this.userService.handleGetUserByUsername(username);
//        if (user == null) {
//            throw new UsernameNotFoundException("Username/password không hợp lệ");
//        }
//
//        return new User(
//                user.getEmail(),
//                user.getPassword(),
//                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
//
//    }
//
//}
package vn.trijava.springrest.config;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import vn.trijava.springrest.domain.Permission;
import vn.trijava.springrest.domain.User;
import vn.trijava.springrest.service.UserService;

@Component
public class UserDetailsCustom implements UserDetailsService {

    @Autowired
    private UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = this.userService.handleGetUserByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("Không tìm thấy người dùng với email: " + username);
        }

        List<SimpleGrantedAuthority> authorities = getUserAuthorities(user);

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities);
    }

    private List<SimpleGrantedAuthority> getUserAuthorities(User user) {
        if (user.getRole() != null && user.getRole().getPermissions() != null) {
            return user.getRole().getPermissions().stream()
                    .map(permission -> new SimpleGrantedAuthority(permission.getName()))
                    .collect(Collectors.toList());
        }
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }
}